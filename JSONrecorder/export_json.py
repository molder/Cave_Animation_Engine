# ==================================================
# Cave Animation Engine
# JSONrecorder
# export_json.py
#
# TDYolo slot1 motion exporter
#
# Input:
#   TouchDesigner CHOP to DAT
#
# Output:
#   Cave_Animation_Engine/style/animation_take01.json
#
# ==================================================


import json
import os



# ==================================================
# INPUT CHOP TO DAT
# ==================================================

# Change this name if your CHOP to DAT has another name

source = op("/JSON_cam/slot1_data")


if source is None:

    print("ERROR: slot1_data not found")

else:

    print("Input found:")
    print(source.numRows)
    print(source.numCols)



# ==================================================
# JOINTS USED BY CAVE ENGINE
# ==================================================


JOINTS = [

    "nose",

    "left_shoulder",
    "right_shoulder",

    "left_elbow",
    "right_elbow",

    "left_wrist",
    "right_wrist",

    "left_hip",
    "right_hip",

    "left_knee",
    "right_knee",

    "left_ankle",
    "right_ankle"

]



# ==================================================
# READ CHANNEL DATA
# ==================================================


channels = {}



for row in range(1, source.numRows):


    channel_name = source[row,0].val


    channels[channel_name] = []



    for col in range(1, source.numCols):


        value = float(
            source[row,col].val
        )


        channels[channel_name].append(
            value
        )



print(
    "Channels loaded:",
    len(channels)
)



# ==================================================
# CREATE ANIMATION FRAMES
# ==================================================


frame_count = source.numCols - 1



frames = []



for frame_index in range(frame_count):


    frame = {}



    for joint in JOINTS:


        x_channel = (
            "slot1_"
            + joint
            + "_x"
        )


        y_channel = (
            "slot1_"
            + joint
            + "_y"
        )



        if (

            x_channel in channels

            and

            y_channel in channels

        ):


            frame[joint] = [

                channels[x_channel][frame_index],

                channels[y_channel][frame_index]

            ]



    # ==========================================
    # DERIVED JOINTS
    # ==========================================


    # neck = midpoint of shoulders

    if (
        "left_shoulder" in frame
        and
        "right_shoulder" in frame
    ):

        frame["neck"] = [

            (
                frame["left_shoulder"][0]
                +
                frame["right_shoulder"][0]
            )
            / 2,


            (
                frame["left_shoulder"][1]
                +
                frame["right_shoulder"][1]
            )
            / 2
            - 0.08

        ]




    # center hip

    if (
        "left_hip" in frame
        and
        "right_hip" in frame
    ):

        frame["center_hip"] = [

            (
                frame["left_hip"][0]
                +
                frame["right_hip"][0]
            )
            / 2,


            (
                frame["left_hip"][1]
                +
                frame["right_hip"][1]
            )
            / 2

        ]





    # spine = middle between neck and hips

    if (
        "neck" in frame
        and
        "center_hip" in frame
    ):

        frame["spine"] = [

            (
                frame["neck"][0]
                +
                frame["center_hip"][0]
            )
            / 2,


            (
                frame["neck"][1]
                +
                frame["center_hip"][1]
            )
            / 2

        ]



    frames.append(frame)



print(
    "Frames created:",
    len(frames)
)



# ==================================================
# BUILD JSON STRUCTURE
# ==================================================


animation = {


    "version":

    "CaveAnimation_V1",



    "name":

    "recorded_take01",



    "source":

    "TDYolo_slot1",



    "fps":

    60,



    "frames":

    frames


}



# ==================================================
# SAVE INTO STYLE FOLDER
# ==================================================


from config import CAVE_STYLE_FOLDER


style_folder = CAVE_STYLE_FOLDER



if not os.path.exists(style_folder):

    os.makedirs(style_folder)



output_file = os.path.join(

    style_folder,

    "animation_take01.json"

)



with open(

    output_file,

    "w"

) as f:


    json.dump(

        animation,

        f,

        indent=4

    )



print("==============================")

print("EXPORT COMPLETE")

print(output_file)

print("==============================")