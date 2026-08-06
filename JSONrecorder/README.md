# Cave Animation Engine
# JSON Motion Recorder

## Overview

The JSON Recorder is a bridge between TouchDesigner pose tracking and the Cave Animation Engine.

It converts live body tracking data from TDYolo into reusable animation files.

The recorded motion can later drive:

- skeleton animation
- image mesh deformation
- procedural effects
- performance archives


---

# Workflow


Camera

↓

TDYolo Pose Tracking

↓

OSC / CHOP Data

↓

Slot Sorting

↓

Record CHOP

↓

CHOP to DAT

↓

JSON Recorder

↓

style/*.json

↓

Cave Animation Engine



---

# Data Source

The recorder currently uses:
slot1


from the multislot tracking system.

The input contains:


slot1_active
slot1_opacity

slot1_joint_x
slot1_joint_y

slot1_joint_vx
slot1_joint_vy


Example:


slot1_left_wrist_x
slot1_left_wrist_y


Coordinates are normalized:


0.0 - 1.0


The Cave Animation Engine converts these values into canvas coordinates.


---

# Supported Joints



nose

left_shoulder
right_shoulder

left_elbow
right_elbow

left_wrist
right_wrist

left_hip
right_hip

left_knee
right_knee

left_ankle
right_ankle



---

# Recording


Typical settings:

Record CHOP:


Record Input:
Current Frame

Interpolation:
Linear

Record Output:
Segment

Segment:
0 - 60



60 frames equals approximately:


1 second at 60fps



For longer movements:


0 - 600


equals:


10 seconds at 60fps



---

# Export


The exporter creates:



Cave_Animation_Engine/

style/

animation_take01.json



Example:

```json
{
 "name":"recorded_take01",
 "fps":60,
 "frames":[

 {
 "left_wrist":[0.45,0.63],
 "right_wrist":[0.40,0.56]
 }

 ]
}

Each frame contains the body position.

Why JSON?

A video stores pixels.

The JSON stores movement.

Advantages:

editable
lightweight
loopable
interpolatable
can drive different images
can combine with physics

A recorded dance can become:

a human animation
a particle source
a shader controller
a projection mapping movement
Future Development

Planned:

Animation Library
style/

breathing/

walking/

hiphop/

techno/

ceremony/
Physics Layer

Use velocity channels:

vx
vy

for:

inertia
elastic movement
delayed reactions
organic deformation
Animation Editor

Allow:

trimming
looping
blending
speed control
keyframe editing
Project

Cave Animation Engine

cc2 audiovisual animation system

Motion capture → JSON → Mesh deformation


commit together with `export_json.py`, because this README documents the first version of the **motion capture animation pipeline**.