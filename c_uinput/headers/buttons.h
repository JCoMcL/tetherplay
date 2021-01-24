#include <linux/uinput.h>


void load_dpad(){
// dpad buttons
   struct input_event DPAD_UP = create_key_event(BTN_DPAD_UP, 0);
   struct input_event DPAD_DOWN = create_key_event(BTN_DPAD_DOWN, 0);
   struct input_event DPAD_LEFT = create_key_event(BTN_DPAD_LEFT, 0);
   struct input_event DPAD_RIGHT = create_key_event(BTN_DPAD_RIGHT, 0);
}
void load_gpad(){
   // gamepad buttons
   struct input_event GPAD_NORTH = create_key_event(BTN_NORTH, 0);
   struct input_event GPAD_SOUTH = create_key_event(BTN_SOUTH, 0);
   struct input_event GPAD_WEST = create_key_event(BTN_WEST, 0);
   struct input_event GPAD_EAST = create_key_event(BTN_EAST, 0);
}
void load_menu(){
   // menu buttons
   struct input_event GPAD_START = create_key_event(BTN_START, 0);
   struct input_event GPAD_SELECT = create_key_event(BTN_SELECT, 0);
}

