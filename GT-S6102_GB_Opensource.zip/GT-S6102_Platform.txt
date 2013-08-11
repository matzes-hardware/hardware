How to build platform

1. Get android open source.
    : version info - Android gingerbread 2.3.6
    ( Download site : http://source.android.com )

2. Overwrite modules that you want to build.

 - \external\alsa-lib
 - \external\bluetooth
 - \external\dnsmasq
 - \external\iproute2
 - \external\iptables
 - \external\opencore
 - \hardware\broadcom\bt
 - \libcore\junit
 - \packages\apps\Email
 - \system\core\debuggerd
 - \external\webkit  : Delete this source tree at Android gingerbread and then copy & execute "clean build".

3. Copy the files to original Gingerbread source tree (overwrite) and then make

4. Add the following lines at the end of build/target/board/generic/BoardConfig.mk

BOARD_USES_ALSA_AUDIO := true
BOARD_HAVE_BLUETOOTH := true
BT_ALT_STACK := true
BRCM_BT_USE_BTL_IF := true
BRCM_BTL_INCLUDE_A2DP := true

5. build
- ./build.sh user
