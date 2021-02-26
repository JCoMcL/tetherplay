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
	if (sscanf(input, "{\"i\":\"%i\", \"v\":%s}", &index, &value)){	
		return (json_instruction) {index, value};
	}
}

// needs a better name
int float_to_abs(float f) {
	return (int)f * 512;
}

typedef api_value (*decoder) (char*);

bool decode_inst(char *s) {
	return true;
}

bool decode_bool(char *bool_str){
	if (!strcmp(bool_str, "true}"))
		return true;
	else
		return false;
}

vec decode_vec(char *vec_str){
	vec out;
	int x, y;
	if (sscanf(vec_str, "[%d , %d]}", &x, &y))
		return (vec){ x, y };
	return (vec){0,0};
}

const decoder decoders[] = {
	(decoder)decode_vec,
	(decoder)decode_bool,
	(decoder)decode_bool,
	(decoder)decode_inst
};

api_instruction decode (char *input) {
	json_instruction ji = json_decode(input);
	api_instruction out;
	memset (&out, 0, sizeof(out));
	out.recipient_id = ji.recipient_id;
	out.value = decoders[ji.recipient_id]( ji.value );
	return out;
}
