#include <linux/uinput.h>
#include <sys/ioctl.h>
#include <string.h>
#include <stdio.h>
#include <fcntl.h>

#include<unistd.h>

void emit(int fd, int type, int code, int val)
{
   struct input_event ie;

   ie.type = type;
   ie.code = code;
   ie.value = val;
   ie.time.tv_sec = 0;
   ie.time.tv_usec = 0;

   write(fd, &ie, sizeof(ie));
}

int main(void)
{
   struct uinput_setup usetup;

   int fd = open("/dev/uinput", O_WRONLY | O_NONBLOCK);
   ioctl(fd, UI_SET_EVBIT, EV_KEY);
   ioctl(fd, UI_SET_KEYBIT, KEY_SPACE);

   memset(&usetup, 0, sizeof(usetup));
   usetup.id.bustype = BUS_USB;
   usetup.id.vendor = 0x1234; /* sample vendor */
   usetup.id.product = 0x5678; /* sample product */
   strcpy(usetup.name, "Example device");

   ioctl(fd, UI_DEV_SETUP, &usetup);
   ioctl(fd, UI_DEV_CREATE);

   sleep(1);

   /* Key press, report the event, send key release, and report again */
   emit(fd, EV_KEY, KEY_SPACE, 1);
   emit(fd, EV_SYN, SYN_REPORT, 0);
   emit(fd, EV_KEY, KEY_SPACE, 0);
   emit(fd, EV_SYN, SYN_REPORT, 0);

   sleep(1);

   ioctl(fd, UI_DEV_DESTROY);
   close(fd);

   return 0;
}
