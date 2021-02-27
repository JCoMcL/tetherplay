#include <libevdev-1.0/libevdev/libevdev.h>
#include <libevdev-1.0/libevdev/libevdev-uinput.h> //TODO fix these paths for final release
#include <string.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>

#include "errutil.h"
#include "device.h"

static struct libevdev_uinput *uidev;



static int enable_event_type(struct libevdev *dev, int event_type){
	if (libevdev_has_event_type(dev, event_type))
		return 0;
	else { 
		libevdev_enable_event_type(dev, event_type);
		return 1;
	}
}

static void enable_key_event(struct libevdev *dev, int event_code){
	enable_event_type(dev, EV_KEY);
	if (!libevdev_has_event_code(dev, EV_KEY, event_code))
		libevdev_enable_event_code(dev, EV_KEY, event_code, NULL);
}

static void enable_abs_event(struct libevdev *dev, int event_code, int flat){
	enable_event_type(dev, EV_KEY);
	struct input_absinfo *abs = malloc(sizeof(struct input_absinfo));
	if (!libevdev_has_event_code(dev, EV_ABS, event_code)){
		libevdev_enable_event_code(dev, EV_ABS, event_code, &abs);
		libevdev_set_abs_minimum(dev, event_code, -8);
		libevdev_set_abs_maximum(dev, event_code, 8);
		libevdev_set_abs_flat(dev, event_code, flat);
		libevdev_set_abs_fuzz(dev, event_code, 0);
		libevdev_set_abs_resolution(dev, event_code, 0);
	}
}

static void hardcode_device(struct libevdev *dev) {
	enable_event_type(dev, EV_ABS);
	enable_event_type(dev, EV_KEY);
	enable_abs_event(dev, ABS_X, 15);
	enable_abs_event(dev, ABS_Y, 15);
	enable_key_event(dev, BTN_WEST);
	enable_key_event(dev, BTN_SOUTH);
	enable_key_event(dev, BTN_START);
}

void create_device(char *name){
	int err;

	struct libevdev *dev;
	memset(&dev, 0, sizeof(dev));
	dev = libevdev_new();
	hardcode_device(dev);
	libevdev_set_name(dev, name);

	err = libevdev_uinput_create_from_device( dev, LIBEVDEV_UINPUT_OPEN_MANAGED, &uidev);
	if (err != 0)
		error(1, "error (Could Not Create Device)");

}

static void write_key_event(int code, int value){
	int err = libevdev_uinput_write_event(uidev, EV_KEY, code, value);
	if (err != 0)
		error(0, "error (Write Key Event Error)");
}

static void write_abs_event(int code, int value){
	int err = libevdev_uinput_write_event(uidev, EV_ABS, code, value);
	if (err != 0)
		error(0, "error (Write Abs Event Error)");
}
static void sync_events(){
	int err = libevdev_uinput_write_event(uidev, EV_SYN, SYN_REPORT, 0);
	if (err != 0)
		error(0, "error (Sync Events Error)");
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
	sync_events();
	release(code);
	sync_events();
}

void set_abs( int code, int pos){
	write_abs_event(code, pos);
	sync_events();
}

void cleanup(){
	libevdev_uinput_destroy(uidev);
}
