#include "headers/device.h"

int main(int argc, char *argv[]){
    // opens default file of uinput
    open_default();
    // simple test event for the k button
    setup_gamepad_events(2);
    // creates the device
    create_device();
    sleep(3);
    struct input_event ie = create_key_event(BTN_DPAD_RIGHT, 0);
    press(ie);
    // syncs all events by reporting back to uinput
    sync_events();
    sleep(1);
    release(ie);
    sync_events();
    sleep(1);
    press(ie);
    sync_events();
    sleep(1);
    release(ie);
    sync_events();
    // sleeps for 1 seccond
    sleep(10);
    // clicks the south button
    click(ie);
    // destroys device and closes the uinput file
    destroy_device();
    return 0;
}
