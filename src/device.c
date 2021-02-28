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

static int enable_event(struct libevdev *dev, int type, int code, void *data) {
	RETURN_IF_TRUE(libevdev_has_event_code(dev, EV_KEY, code), EEXIST);
	RETURN_IF_ERROR(libevdev_enable_event_code(dev, type, code, data), EKEYREJECTED);
	return 0;
}
static int enable_key_event(struct libevdev *dev, int code){
	return enable_event(dev, EV_KEY, code, NULL);
}

static int enable_abs_event(struct libevdev *dev, int code, int flat){
	struct input_absinfo *abs = malloc(sizeof(struct input_absinfo));
	if ((errno = -enable_event(dev, EV_ABS, code, &abs)) < 0) {
		free(abs);
		return  -errno;
	}
	libevdev_set_abs_minimum(dev, code, -511);
	libevdev_set_abs_maximum(dev, code, 511);
	libevdev_set_abs_flat(dev, code, 0);
	libevdev_set_abs_fuzz(dev, code, 0);
	libevdev_set_abs_resolution(dev, code, 0);
	return 0;
}

static void hardcode_device(struct libevdev *dev) {
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

	errno = -libevdev_uinput_create_from_device( dev, LIBEVDEV_UINPUT_OPEN_MANAGED, &uidev);
	if (errno != 0)
		error(1, "failed to create device");
}

static void write_event(int type, int code, int value){
	errno = -libevdev_uinput_write_event(uidev, type, code, value);
	if (errno)
		error(0, "failed to write event");
}

static void write_key_event(int code, int value){
	write_event(EV_KEY, code, value);
}

static void write_abs_event(int code, int value){
	write_event(EV_ABS, code, value);
}
static void sync_events(){
	write_event(EV_SYN, SYN_REPORT, 0);
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
	usleep(20000);
	release(code);
}

void set_abs( int code, int pos){
	write_abs_event(code, pos);
	sync_events();
}

void cleanup(){
	libevdev_uinput_destroy(uidev);
}
