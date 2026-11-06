// define a new context request
var contextConfig = ContextConfig{Units_: map[string]string{
		"session_id": "bf06d8cb5d8137290c4abb64155584fbdb64d8",
		"user_id":    "123456",
}}

var ctx = sdk.CreateContext(contextConfig)
ctx.WaitUntilReady()
