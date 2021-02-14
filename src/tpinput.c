#include <stdio.h>

#include "device.h"
#include "tpinput.h"

typedef struct {
	int recipient_id;
	char *value;
} instruction;

static instruction decode(char *json_instruction) {
	return (instruction) {3, json_instruction};
}

int read_input(char *buf, int size) {
	if (fgets(buf, size, stdin))
		return 0;
	return 1;
}

typedef void (*instruction_handler) (char*);
void handle_gp_ljoy(char *vec_str) {}
void handle_gp_south(char *bool_str) {}
void handle_gp_west(char *bool_str) {}
void handle_gp_start(char *null_str) {}

int main() {
	instruction_handler handlers[] = {
		handle_gp_ljoy,
		handle_gp_south,
		handle_gp_west,
		handle_gp_start
	};

	create_device();
	int size = BUFSIZ;
	char line[size];

	for (;;) {
		if (read_input(line, size))
			break;
		printf(line, stdout);
		instruction ins = decode(line);
		handlers[ins.recipient_id](ins.value);
	}
	cleanup();
	return 0;
}
