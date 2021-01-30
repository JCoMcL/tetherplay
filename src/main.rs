extern crate libc;
extern crate uinput_sys;

use libc::{c_int, c_char};
use std::ffi::CString;
use std::{thread, time};



#[allow(improper_ctypes)]
extern "C"{
    static fd: c_int;
    fn sync_events();
    fn press(code: c_int);
    fn release(code: c_int);
    fn click(code: c_int);
    fn setup_dpad_events();
    fn setup_gamepad_events(amt: c_int);
    fn setup_menupad_events();
    fn create_device();
    fn destroy_device();
    fn open_path(path: c_char);
    fn open_default();
}


fn main() {
    unsafe {
        open_default();
        setup_gamepad_events(4);
        create_device();
        loop {
            press(uinput_sys::BTN_SOUTH);
            sync_events();
            println!("PRESS");
            thread::sleep(time::Duration::from_secs(5));
            release(uinput_sys::BTN_SOUTH);
            sync_events();
            println!("RELEASE");
            thread::sleep(time::Duration::from_secs(5));
        }
    }
}
