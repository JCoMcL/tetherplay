#include <libevdev-1.0/libevdev/libevdev.h>
#include <libevdev-1.0/libevdev/libevdev-uinput.h> //TODO fix these paths for final release
#include <string.h>
#include <fcntl.h>
#include <unistd.h>

#include "device.h"

static struct libevdev_uinput *uidev;


static void enable_event(struct libevdev *dev, int type, int event_code){
	libevdev_enable_event_type(dev, type); // only required once per event type
	libevdev_enable_event_code(dev, type, event_code, NULL);
}

static void enable_key_event(struct libevdev *dev, int event_code){
	enable_event(dev, EV_KEY, event_code);
}

static void enable_abs_event(struct libevdev *dev, int event_code){
	enable_event(dev, EV_ABS, event_code);
	struct input_absinfo *abs;
	abs->maximum = 8;
	abs->minimum = -8;
	libevdev_set_abs_info(dev, event_code, abs);
}

static void hardcode_device(struct libevdev *dev) {
	enable_abs_event(dev, ABS_X);
	enable_abs_event(dev, ABS_Y);
	enable_key_event(dev, BTN_SOUTH);
	enable_key_event(dev, BTN_WEST);
	enable_key_event(dev, BTN_START);
}

void create_device(char *name){
	int err;

	struct libevdev *dev;

	dev = libevdev_new();
	hardcode_device(dev);
	libevdev_set_name(dev, name);

	err = libevdev_uinput_create_from_device( dev, LIBEVDEV_UINPUT_OPEN_MANAGED, &uidev);
	if (err != 0) {}

}

void write_key_event(int code, int value){
	libevdev_uinput_write_event(uidev, EV_KEY, code, value);
}

void write_abs_event(int code, int value){
	libevdev_uinput_write_event(uidev, EV_ABS, code, value);
}
void sync_events(){
	libevdev_uinput_write_event(uidev, EV_SYN, SYN_REPORT, 0);
}

void press( int code){
	write_key_event(code, 1);
	sync_events();
}

void release( int code){
	write_key_event(code, 0);
	sync_events();
}

void click( int code){
	press(code);
	release(code);
}

void move_abs_event( int code, int pos){
	write_abs_event(code, pos);
	sync_events();
}

void cleanup(){
	libevdev_uinput_destroy(uidev);
}
