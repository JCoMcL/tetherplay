#include <linux/uinput.h>
#include <sys/ioctl.h>
#include <string.h>
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h> // for sleep
#include <stdlib.h>
#include <getopt.h>
#include "device.h"

// creates the button so it can be easily called without the need of recreating the struct
struct input_event create_key_event(int code, int val){
   struct input_event ie;
   ie.type = EV_KEY;
   ie.code = code;
   ie.value = val;
   ie.time.tv_sec = 0;
   ie.time.tv_usec = 0;
   return ie;
}


//  syncronizes all key events
void sync_events(){
   struct input_event ie;
   ie.type = EV_SYN;
   ie.code = SYN_REPORT;
   ie.value = 0;
   ie.time.tv_sec = 0;
   ie.time.tv_usec = 0;
   write(fd, &ie, sizeof(ie));
}


// sets press event
void press(int code){
   struct input_event ie = create_key_event(code, 1);
   write(fd, &ie, sizeof(ie));
}
// sets release event
void release(int code){
   struct input_event ie = create_key_event(code, 0);
   write(fd, &ie, sizeof(ie));
}

// clicks event
void click(int code){
   press(code);
   sync_events();
   release(code);
   sync_events();
}

void move_joystick(int code, int pos){
   struct input_event ie = create_key_event(code, pos);
   write(fd, &ie, sizeof(ie));
}
// enables dpad events when called
void setup_dpad_events(){
   ioctl(fd, UI_SET_KEYBIT, BTN_DPAD_UP);
   ioctl(fd, UI_SET_KEYBIT, BTN_DPAD_LEFT);
   ioctl(fd, UI_SET_KEYBIT, BTN_DPAD_DOWN);
   ioctl(fd, UI_SET_KEYBIT, BTN_DPAD_RIGHT);
}

// enables action pad events when called
// the amt_btn int is for how many buttons are going to be used 2, 3 or 4
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

// enables the start and select events when called
void setup_menupad_events(){
   ioctl(fd, UI_SET_KEYBIT, BTN_START);
   ioctl(fd, UI_SET_KEYBIT, BTN_SELECT);
}
// left joystick enabled
void setup_joystick_left_events(){
   ioctl(fd, UI_SET_KEYBIT, ABS_X);
   ioctl(fd, UI_SET_KEYBIT, ABS_Y);
}

// enable right joystick
void setup_joystick_right_events(){
   ioctl(fd, UI_SET_KEYBIT, ABS_RX);
   ioctl(fd, UI_SET_KEYBIT, ABS_RY);
}

// creates a device
void create_device(){
   struct uinput_setup usetup;
   memset(&usetup, 0, sizeof(usetup));
   usetup.id.bustype = BUS_USB;
   usetup.id.vendor = 0x1234;
   usetup.id.product = 0x5678;
   strcpy(usetup.name, "Test");
   // links device to use other events
   ioctl(fd, UI_DEV_SETUP, &usetup);
   ioctl(fd, UI_DEV_CREATE);
   sleep(1);
}

// destroys the uinput device
void destroy_device(){
   ioctl(fd, UI_DEV_DESTROY);
   close(fd);
}

// if uinput is not located in dev folder give it a path
void open_path(char* path){
   fd = open(path, O_WRONLY | O_NONBLOCK);
   ioctl(fd, UI_SET_EVBIT, EV_KEY);
}

// if uinput is located in dev folder
void open_default(){
   open_path("/dev/uinput");
}
