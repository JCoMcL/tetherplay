#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <linux/input.h>

#include "device.h"
#include "tpinput.h"

typedef struct {
	int recipient_id;
	char *value;
} instruction;

static instruction decode(char *json_instruction) {
	int index;
	char value[100];
	if (sscanf(json_instruction, "{\"i\":%d,\"v\":%s}", &index, &value)){
		printf("%d", index);
		printf(": %s", value);
		return (instruction) {index, value};
	}
}

int read_input(char *buf, int size) {
	if (fgets(buf, size, stdin))
		return 0;
	return 1;
}


void handle_abs(char *vec_str, int x_abs, int y_abs){
	float x_axis, y_axis;
	if (sscanf(vec_str, "[%f , %f]", &x_axis, &y_axis)){
		set_abs(x_abs, (int)(x_axis * 8.00));
		set_abs(y_abs, (int)(y_axis * 8.00));
	}
}

void handle_bool(char *bool_str, int button){
	if (!strcmp(bool_str, "true}")){
		press(button);
	} else {
		release(button);
	}
}

typedef void (*instruction_handler) (char*);
void handle_gp_ljoy(char *vec_str) {	
	handle_abs(vec_str, ABS_X, ABS_Y);
}
void handle_gp_rjoy(char *vec_str){
	handle_abs(vec_str, ABS_RX, ABS_RY);
}
void handle_gp_south(char *bool_str) {
	handle_bool(bool_str, BTN_SOUTH);
}
void handle_gp_west(char *bool_str) {
	handle_bool(bool_str, BTN_WEST);
}
void handle_gp_north(char *bool_str) {
	handle_bool(bool_str, BTN_NORTH);
}
void handle_gp_east(char *bool_str) {
	handle_bool(bool_str, BTN_EAST);
}
void handle_gp_start(char *null_str) {
	click(BTN_START);
}

int main() {
	instruction_handler handlers[] = {
		handle_gp_ljoy,
		//handle_gp_rjoy,
		handle_gp_north,
		handle_gp_east,
		handle_gp_west,
		handle_gp_south,
		handle_gp_start
	};

	create_device("tp-input-js0");
	int size = BUFSIZ;
	char line[size];
	// until eof
	for (;;) {
		if (read_input(line, size))
			break;
		printf(line, stdout);
		
		// print to stdout
		instruction ins = decode(line);
		// decode to index and value
		handlers[ins.recipient_id](ins.value);
		//call function

	}
	cleanup();
	return 0;
}
