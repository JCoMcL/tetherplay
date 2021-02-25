#include <string.h>
#include <stdio.h>
#include "api.h"
#include "json_api.h"

typedef struct {
	int recipient_id;
	char *value;
} json_instruction;

static json_instruction json_decode(char *input) {
	int index;
	char value[100];
	int has_value = 0;
	for (int i=0; input[i] != '\0'; i++){
		if (input[i] == '}')
			break;
		else if(input[i] == 'i'){
			index = input[i+=3] - 48;
		}
		else if (input[i] == 'v'){
			has_value = 1;
			i += 2;
		}
		else if (has_value){
			if (!(input[i] == ' '))
				strncat(value, &input[i], 1);
		}
	}
	strcpy(input, value);
	return (json_instruction) {index, input};
}

// needs a better name
int float_to_abs(float f) {
	return (int)f * 512;
}

api_instruction decode_inst(char *s) {
	return true;
}

bool decode_bool(char *bool_str){
	if (!strcmp(bool_str, "true"))
		return true;
	else
		return false;
}

vec decode_vec(char *vec_str){
	vec out;
	float x, y;
	if (sscanf(vec_str, "[%f , %f]", &x, &y))
		return (vec){ float_to_abs(x), float_to_abs(y) };
	return NULL;
}

api_instruction decode (char *input) {
	
}
