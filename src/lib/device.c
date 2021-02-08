#include <libevdev/libevdev.h>
#include <libevdev/libevdev-uinput.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>

#include "device.h"

void enable_event(struct libevdev *dev, int type, int event_code){
	libevdev_enable_event_type(dev, type); // only required once per event type
	libevdev_enable_event_code(dev, type, event_code, NULL);
}

void enable_key_event(struct libevdev *dev, int event_code){
	enable_event(dev, EV_KEY, event_code);
}

void enable_abs_event(struct libevdev *dev, int event_code){
	enable_event(dev, EV_ABS, event_code);
}

void cleanup(struct libevdev_uinput *dev){
	libevdev_uinput_destroy(dev);
}

void hardcode_device(struct libevdev *dev) {
	enable_abs_event(dev, ABS_X);
	enable_abs_event(dev, ABS_Y);
	enable_key_event(dev, BTN_SOUTH);
	enable_key_event(dev, BTN_WEST);
	enable_key_event(dev, BTN_START);
}

struct libevdev_uinput *create_device(char *name){
	int err;

	struct libevdev *dev;

	dev = libevdev_new();
	libevdev_set_name(dev, "test device");
	hardcode_device(dev);

	struct libevdev_uinput *uidev;
	err = libevdev_uinput_create_from_device( dev, LIBEVDEV_UINPUT_OPEN_MANAGED, &uidev);
	if (err != 0) {}

	return uidev;
}

void write_key_event(struct libevdev_uinput *dev, int code, int value){
	libevdev_uinput_write_event(dev, EV_KEY, code, value);
}

void sync_events(struct libevdev_uinput *dev){
	libevdev_uinput_write_event(dev, EV_SYN, SYN_REPORT, 0);
}

void press(struct libevdev_uinput *dev, int code){
	write_key_event(dev, code, 1);
	sync_events(dev);
}

void release(struct libevdev_uinput *dev, int code){
	write_key_event(dev, code, 0);
	sync_events(dev);
}

void click(struct libevdev_uinput *dev, int code){
	press(dev, code);
	release(dev, code);
}

void move_joystick(struct libevdev_uinput *dev, int code, int pos){
	write_key_event(dev, code, pos);
}

int main() {
	struct libevdev_uinput *dev = create_device("test");

	press(dev, BTN_SOUTH);
	sleep(1);
	release(dev, BTN_SOUTH);
	sleep(1);
	return 0;
}
