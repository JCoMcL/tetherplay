#include <linux/uinput.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>

#include "device.h"

int fd;

struct input_event create_input_event(int type, int code, int val){
   return (struct input_event) {{0}, type, code, val};
}

struct input_event create_key_event(int code, int val){
   return create_input_event(EV_KEY, code, val);
}

void write_input_event(struct input_event ie) {
   write(fd, &ie, sizeof(ie));
}

// execute buffered events
void sync_events(){
   write_input_event( create_input_event(EV_SYN, SYN_REPORT, 0) );
}

void press(int code){
   write_input_event( create_key_event(code, 1) );
}

void release(int code){
   write_input_event( create_key_event(code, 0) );
}

// press and release; in short succesion
void click(int code){
   press(code);
   sync_events();
   release(code);
   sync_events();
}

void move_joystick(int code, int pos){
   write_input_event( create_key_event(code, pos) );
}

void setup_dpad_events(){
   ioctl(fd, UI_SET_KEYBIT, BTN_DPAD_UP);
   ioctl(fd, UI_SET_KEYBIT, BTN_DPAD_LEFT);
   ioctl(fd, UI_SET_KEYBIT, BTN_DPAD_DOWN);
   ioctl(fd, UI_SET_KEYBIT, BTN_DPAD_RIGHT);
}

void setup_gamepad_south(){
   ioctl(fd, UI_SET_KEYBIT, BTN_SOUTH);
}
void setup_gamepad_east(){
   ioctl(fd, UI_SET_KEYBIT, BTN_EAST);
}
void setup_gamepad_west(){
   ioctl(fd, UI_SET_KEYBIT, BTN_WEST);
}
void setup_gamepad_north(){
   ioctl(fd, UI_SET_KEYBIT, BTN_NORTH);
}

// enable start and select buttons
void setup_menupad_events(){
   ioctl(fd, UI_SET_KEYBIT, BTN_START);
   ioctl(fd, UI_SET_KEYBIT, BTN_SELECT);
}

void setup_joystick_left_events(){
   ioctl(fd, UI_SET_KEYBIT, ABS_X);
   ioctl(fd, UI_SET_KEYBIT, ABS_Y);
}

void setup_joystick_right_events(){
   ioctl(fd, UI_SET_KEYBIT, ABS_RX);
   ioctl(fd, UI_SET_KEYBIT, ABS_RY);
}

void create_device(){
   struct uinput_setup usetup;
   memset(&usetup, 0, sizeof(usetup));
   usetup.id.bustype = BUS_USB;
   usetup.id.vendor = 0x1234;
   usetup.id.product = 0x5678;
   strcpy(usetup.name, "Test");

   ioctl(fd, UI_DEV_SETUP, &usetup);
   ioctl(fd, UI_DEV_CREATE);
   sleep(1); // returning immediately can cause problems
}

void destroy_device(){
   ioctl(fd, UI_DEV_DESTROY);
   close(fd);
}

// open uinput at provided path and set global file-descriptor
void open_path(char* path){
   fd = open(path, O_WRONLY | O_NONBLOCK);
   ioctl(fd, UI_SET_EVBIT, EV_KEY);
}

void open_default(){
   open_path("/dev/uinput");
}
