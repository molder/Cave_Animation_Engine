#!/usr/bin/env python3
# ==================================================
# Cave Animation Engine
# reduce_walking.py
#
# Takes the huge recorded walking.json, samples it
# down to a handful of key poses, interpolates a
# smooth 600-frame animation between them, adds
# subtle organic noise so it doesn't look robotic,
# and blends the tail back into the head so the
# clip loops seamlessly.
#
# Run from inside the style/ folder:
#   python3 reduce_walking.py
# ==================================================

import json
import math
import random

INPUT_PATH  = "walking.json"
OUTPUT_PATH = "walking_600.json"

NUM_SAMPLE_POSES  = 100    # poses pulled out of the original recording
OUTPUT_FRAMES     = 600    # final frame count after interpolation
NOISE_AMPLITUDE   = 0.004  # subtle per-joint variation (normalized 0..1 space)
LOOP_BLEND_FRAMES = 40     # tail frames blended toward the start for a seamless loop

random.seed(42)  # change or remove this line to get a different noise pattern each run


def load_frames(path):
    with open(path, "r") as f:
        data = json.load(f)
    return data, data["frames"]


def sample_poses(frames, count):
    n = len(frames)
    if count >= n:
        return frames
    step = (n - 1) / (count - 1)
    indices = [round(i * step) for i in range(count)]
    return [frames[i] for i in indices]


def lerp(a, b, t):
    return a + (b - a) * t


def smoothstep(t):
    # ease-in/ease-out between poses instead of stiff linear motion
    return t * t * (3 - 2 * t)


def interpolate_pose(pose_a, pose_b, t):
    t_eased = smoothstep(t)
    joints = set(pose_a.keys()) & set(pose_b.keys())
    out = {}
    for j in joints:
        ax, ay = pose_a[j]
        bx, by = pose_b[j]
        out[j] = [lerp(ax, bx, t_eased), lerp(ay, by, t_eased)]
    return out


def add_noise(pose, phase_offsets, frame_index, amplitude):
    out = {}
    for j, (x, y) in pose.items():
        if j not in phase_offsets:
            phase_offsets[j] = (random.uniform(0, math.tau), random.uniform(0, math.tau))
        px, py = phase_offsets[j]
        nx = math.sin(frame_index * 0.13 + px) * amplitude
        ny = math.sin(frame_index * 0.11 + py) * amplitude
        out[j] = [x + nx, y + ny]
    return out


def build_frames(sampled_poses, total_frames, noise_amp):
    segments = len(sampled_poses) - 1
    frames_per_segment = total_frames / segments
    phase_offsets = {}
    output = []

    for i in range(total_frames):
        pos = i / frames_per_segment
        seg = min(int(pos), segments - 1)
        t = pos - seg
        pose = interpolate_pose(sampled_poses[seg], sampled_poses[seg + 1], t)
        pose = add_noise(pose, phase_offsets, i, noise_amp)
        output.append(pose)

    return output


def blend_loop(frames, blend_count):
    n = len(frames)
    blend_count = min(blend_count, n // 2)
    for i in range(blend_count):
        idx = n - blend_count + i
        t = (i + 1) / blend_count
        start_pose = frames[i]
        end_pose = frames[idx]
        joints = set(start_pose.keys()) & set(end_pose.keys())
        blended = {}
        for j in joints:
            ex, ey = end_pose[j]
            sx, sy = start_pose[j]
            blended[j] = [lerp(ex, sx, t), lerp(ey, sy, t)]
        frames[idx] = blended
    return frames


def main():
    data, original_frames = load_frames(INPUT_PATH)
    print(f"Original frames: {len(original_frames)}")

    sampled = sample_poses(original_frames, NUM_SAMPLE_POSES)
    print(f"Sampled poses: {len(sampled)}")

    frames = build_frames(sampled, OUTPUT_FRAMES, NOISE_AMPLITUDE)
    frames = blend_loop(frames, LOOP_BLEND_FRAMES)

    out_data = {
        "version": data.get("version", "CaveAnimation_V1"),
        "name": data.get("name", "recorded_take01") + "_reduced",
        "source": data.get("source", "generated"),
        "fps": data.get("fps", 60),
        "frames": frames
    }

    with open(OUTPUT_PATH, "w") as f:
        json.dump(out_data, f)

    print(f"Wrote {len(frames)} frames to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
