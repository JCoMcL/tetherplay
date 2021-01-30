extern crate libc;

use libc::{c_int, c_char};

#[allow(improper_ctypes)]
extern "C"{
    pub fn sync_events();
    pub fn press(code: c_int);
    pub fn release(code: c_int);
    pub fn click(code: c_int);
    pub fn setup_dpad_events();
    pub fn setup_gamepad_events(amt: c_int);
    pub fn setup_menupad_events();
    pub fn create_device();
    pub fn destroy_device();
    pub fn open_path(path: c_char);
    pub fn open_default();
}

