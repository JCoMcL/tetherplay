extern crate uinput;


mod device;
use device::{create_controller};

// creates a test device called KeyboardTest
// places that test device into out controller struct for later use
// runs a for loop 10 times so we get 10 keypresses
fn main() {
    let mut test = create_controller("KeyboardTest");
    for _ in 0..10 {
        test.click_event();
    }
    println!("{}", test.test_gamepad("Up"));
    println!("{}", test.test_dpad("Up"));
}
