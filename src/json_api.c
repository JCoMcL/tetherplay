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
	if (sscanf(input, "{\"i\":%d,\"v\":%s}", &index, value)){
		printf("%d", index);
		printf(": %s", value);
		return (json_instruction) {index, value};
	}
	return NULL;
}

// needs a better name
int float_to_abs(float f) {
	return (int)f * 8.0;
}

typedef api_value (*decoder) (char*);

api_instruction decode_inst(char *s) {
	return true;
}

bool decode_bool(char *bool_str){
	return strcmp(bool_str, "true");
}

vec decode_vec(char *vec_str){
	vec out;
	float x, y;
	if (sscanf(vec_str, "[%f , %f]", &x, &y))
		return (vec){ float_to_abs(x), float_to_abs(y) };
	return NULL;
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
