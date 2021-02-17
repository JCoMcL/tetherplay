#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <stdbool.h>
#include <linux/input.h>
#include "device.h"
#include "tpinput.h"

typedef struct {
	int recipient_id;
	char *value;
} instruction;

static instruction decode(char *json_instruction) {
	int index;
	char value[50];
	int has_value = 0;
	for (int i=0; json_instruction[i] != '\0'; i++){
		if (json_instruction[i] == '}')
			break;
		else if(json_instruction[i] == 'i'){
			index = json_instruction[i+=3] - 48;
		}
		else if (json_instruction[i] == 'v'){
			has_value = 1;
			i += 2;
		}
		else if (has_value){
			if (!(json_instruction[i] == ' '))
				strncat(value, &json_instruction[i], 1);
		}
	}
	strcpy(json_instruction, value);
	//sscanf( json_instruction, "{\"i\":%d,\"v\":%s}\n", &index, value );
	return (instruction) {index, json_instruction};
}

int read_input(char *buf, int size) {
	if (fgets(buf, size, stdin))
		return 0;
	return 1;
}

bool str_to_bool(char *bool_str) {
	if (!strcmp(bool_str, "true")){return false;}
	else {return true;}
}

typedef void (*instruction_handler) (char*);
void handle_gp_ljoy(char *vec_str) {}
void handle_gp_south(char *bool_str) {
	if (str_to_bool(bool_str)){
		press(BTN_SOUTH);
	} else {
		release(BTN_SOUTH);
	}
}
void handle_gp_west(char *bool_str) {}
void handle_gp_start(char *null_str) {}

int main() {
	instruction_handler handlers[] = {
		handle_gp_ljoy,
		handle_gp_south,
		handle_gp_west,
		handle_gp_start
	};

	create_device("test");
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
