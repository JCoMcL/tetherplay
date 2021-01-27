#include "headers/device.h"
#include <getopt.h>

// options for setting up the controller
static const struct option longopts[] = {
    {"name", 1, 0, 'n'},
    {"gamepad", 1, 0, 'g'},
    {"dpad", 0, 0, 'd'},
    {"rightstick", 0, 0, 'r'},
    {"leftstick", 0, 0, 'l'},
    {"menu", 0, 0, 'm'},
};


int main(int argc, char *argv[]){
    // open default path
    open_default();
    char *name;
    // arguments
    int ch;
    while ((ch = getopt_long(argc, argv, "n:g:drlm", longopts, NULL)) != EOF){
        switch(ch){
            case 'n':
                name = optarg;
                break;
            case 'g':
                setup_gamepad_events(atoi(optarg));
                break;
            case 'd':
                setup_dpad_events();
                break;
            case 'r':
                setup_joystick_right_events();
                break;
            case 'l':
                setup_joystick_left_events();
                break;
            case 'm':
                setup_menupad_events();
                break;
        }
    }
    // creates the device
    create_device(name);
    // destroys device and closes the uinput file
    destroy_device();
    return 0;
}
