/* automatically generated by rust-bindgen 0.54.1 */

extern "C" {
    pub fn cleanup();
}
extern "C" {
    pub fn move_joystick(code: ::std::os::raw::c_int, pos: ::std::os::raw::c_int);
}
extern "C" {
    pub fn click(code: ::std::os::raw::c_int);
}
extern "C" {
    pub fn release(code: ::std::os::raw::c_int);
}
extern "C" {
    pub fn press(code: ::std::os::raw::c_int);
}
extern "C" {
    pub fn sync_events();
}
extern "C" {
    pub fn write_key_event(code: ::std::os::raw::c_int, value: ::std::os::raw::c_int);
}
extern "C" {
    pub fn create_device();
}
