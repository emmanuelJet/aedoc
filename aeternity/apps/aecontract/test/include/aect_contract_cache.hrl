-define(COMPILE_TAB, aect_test_utils_compilation_cache).
-define(ENCODE_CALL_TAB, aect_test_utils_encode_call_cache).
-define(DECODE_CALL_TAB, aect_test_utils_decode_call_cache).
-record(compilation_id, {vsn, filename}).
-record(compilation_cache_entry, {compilation_id:: #compilation_id{}, result:: term()}).
-record(encode_call_id, {vsn, code_hash, fun_name, args, backend}).
-record(encode_call_cache_entry, {call_id:: #encode_call_id{}, result:: term()}).
-record(decode_call_id, {code_hash, fun_name, res, val}).
-record(decode_call_cache_entry, {decode_call_id:: #decode_call_id{}, result:: term()}).

cached_tables() ->
    [ {?COMPILE_TAB, #compilation_cache_entry.compilation_id}
    , {?ENCODE_CALL_TAB, #encode_call_cache_entry.call_id}
    , {?DECODE_CALL_TAB, #decode_call_cache_entry.decode_call_id}].
