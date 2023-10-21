#include <string.h>
#include <stdio.h>
#include "api.h"
#include "json_api.h"
#include "errutil.h"

typedef struct {
	int recipient_id;
	char *value;
} json_instruction;

static json_instruction json_decode(char *input, char *value_buf) {
	int index;
	int result = sscanf(input, "{\"i\":%d,\"v\":%s}", &index, value_buf);
	if (result == EOF)
		return (json_instruction) {errno, NULL};

	return (json_instruction) {index, value_buf};
}

static int int4_to_abs(int int4) {
	return int4 * 73; //TODO make more generic version
}

typedef api_value (*decoder) (char*);

static void *decode_inst(char *s) {
	return NULL;
}

static bool decode_bool(char *bool_str){
	return (!strcmp(bool_str, "true}"));
}

static vec decode_vec(char *vec_str){
	int x, y;
	x = y = 0;
	sscanf(vec_str, "[%d,%d]}", &x, &y);
	return (vec){ int4_to_abs(x), int4_to_abs(y) };
}

static const decoder decoders[] = {
	(decoder)decode_vec,
	(decoder)decode_bool,
	(decoder)decode_bool,
	(decoder)decode_inst
};
static const int decoder_count = 4;

api_instruction decode (char *input) {
	char value_buf[100] = "";
	json_instruction ji = json_decode(input, value_buf);

	if ( ji.recipient_id < 0)
		return (api_instruction){ji.recipient_id, NULL};

	if (ji.recipient_id >= decoder_count)
		return (api_instruction){-EFAULT, NULL};

	api_instruction out;
	memset (&out, 0, sizeof(out));
	out.recipient_id = ji.recipient_id;

	out.value = decoders[ji.recipient_id]( ji.value );
	return out;
}
