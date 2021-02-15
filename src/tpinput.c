#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#include "device.h"
#include "tpinput.h"

typedef struct {
	int recipient_id;
	char *value;
} instruction;

static instruction decode(char *json_instruction) {
	int index;
	char value[100];
	int has_value = 0;
	for (int i=0; i < strlen(json_instruction); i++){
		if (json_instruction[i] == '}'){
			break;
		}
		else if(json_instruction[i] == 'i' && json_instruction[i] != '\0'){
			index = json_instruction[i + 2];
		}
		else if (json_instruction[i] == 'v' && json_instruction[i] != '\0'){
			has_value = 1;
			i ++;
		}
		else if (has_value && json_instruction[i] != '\0'){
			strncat(value, &json_instruction[i], 1);
		}
	}
	printf("%s", value);
	//sscanf( json_instruction, "{\"i\":%d,\"v\":%s}\n", &index, value );
	return (instruction) {index, value};
}

int read_input(char *buf, int size) {
	if (fgets(buf, size, stdin))
		return 0;
	return 1;
}

int bool_to_str(char *bool_str) {
	if (strcmp(bool_str, "true") == 0){return 1;}
	else {return 0;}
}

typedef void (*instruction_handler) (char*);
void handle_gp_ljoy(char *vec_str) {}
void handle_gp_south(char *bool_str) {
	if (bool_to_str(bool_str)){
		press(304);
	}
	else {
		release(304);
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
		//handlers[ins.recipient_id](ins.value);
		//call function

	}
	cleanup();
	return 0;
}
