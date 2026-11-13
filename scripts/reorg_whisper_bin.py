import os
import shutil

p_win_src = r"c:\Users\adel\Documents\IC\Athar_DZ\.athar-tools\bin\whisper_cpp\windows_amd64\Release"
p_win_dst = r"c:\Users\adel\Documents\IC\Athar_DZ\.athar-tools\bin\whisper_cpp\windows_amd64"

if os.path.exists(p_win_src):
    for f in os.listdir(p_win_src):
        src_f = os.path.join(p_win_src, f)
        dst_f = os.path.join(p_win_dst, f)
        if not os.path.exists(dst_f):
            shutil.copy2(src_f, dst_f)
    print("Windows binaries moved up successfully.")

p_lin_src = r"c:\Users\adel\Documents\IC\Athar_DZ\.athar-tools\bin\whisper_cpp\linux_amd64\whisper-bin-ubuntu-x64"
p_lin_dst = r"c:\Users\adel\Documents\IC\Athar_DZ\.athar-tools\bin\whisper_cpp\linux_amd64"

if os.path.exists(p_lin_src):
    for f in os.listdir(p_lin_src):
        src_f = os.path.join(p_lin_src, f)
        dst_f = os.path.join(p_lin_dst, f)
        if not os.path.exists(dst_f):
            shutil.copy2(src_f, dst_f)
    print("Linux binaries moved up successfully.")
