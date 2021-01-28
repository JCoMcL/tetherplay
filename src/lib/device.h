#include <linux/uinput.h>
#include <sys/ioctl.h>
#include <string.h>
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h> // for sleep
#include <stdlib.h>

int fd;
struct input_event create_key_event(int code, int val);
void sync_events();
void press(int code);
void release(int code);
void click(int code);
void setup_dpad_events();
void setup_gamepad_events();
void setup_menupad_events();
void setup_joystick_left_events();
void setup_joystick_right_events();
void create_device(char* str);
void open_default();
void open_path(char* str);
void destroy_device();

