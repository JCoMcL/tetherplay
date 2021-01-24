#include <linux/uinput.h>
#include <sys/ioctl.h>
#include <string.h>
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h> // for sleep
#include <stdlib.h>

// global variables
int fd;


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



void press(struct input_event ie){
   if (!ie.value){
      ie = create_key_event(ie.code, 1);
      write(fd, &ie, sizeof(ie));
   } else {
      fprintf(stderr, "Button Is Pressed...Exiting\n");
      exit(EXIT_FAILURE);
   }
}
void release(struct input_event ie){
   if (ie.value){
      ie = create_key_event(ie.code, 0);
      write(fd, &ie, sizeof(ie));
   } else {
      fprintf(stderr, "Button Is Released...Exiting\n");
      exit(EXIT_FAILURE);
   }
}

// toggles event from pressed to released
void toggle(struct input_event ie){
   if (ie.value){
      release(ie);
   } else {
      press(ie);
   }
}

// clicks event
void click(struct input_event ie){
   write(fd, &ie, sizeof(ie));
   sync_events(fd);
   write(fd, &ie, sizeof(ie));
   sync_events(fd);
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
void setup_gamepad_events(int amt_btn){
   ioctl(fd, UI_SET_KEYBIT, BTN_SOUTH);
   ioctl(fd, UI_SET_KEYBIT, BTN_EAST);
   if (amt_btn > 2){
      ioctl(fd, UI_SET_KEYBIT, BTN_WEST);
   }
   if (amt_btn > 3){
      ioctl(fd, UI_SET_KEYBIT, BTN_NORTH);
   }
}

// enables the start and select events when called
void setup_menupad_events(){
   ioctl(fd, UI_SET_KEYBIT, BTN_START);
   ioctl(fd, UI_SET_KEYBIT, BTN_SELECT);
}
// used for testing the k key
void test_events(){
   
   ioctl(fd, UI_SET_KEYBIT, KEY_K);
}
// creates a device
void create_device(){
   struct uinput_setup usetup;
   memset(&usetup, 0, sizeof(usetup));
   usetup.id.bustype = BUS_USB;
   usetup.id.vendor = 0x1234;
   usetup.id.product = 0x5678;
   strcpy(usetup.name, "TEST");
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

