createNewContext() async{
  final ContextConfig contextConfig = ContextConfig.create()
      .setUnit("session_id", "5ebf06d8cb5d8137290c4abb64155584fbdb64d8"); // a unique id identifying the user

  final Context? context = await sdk.createContext(contextConfig)
      .waitUntilReady();

  if(context != null){
    print("context ready");
  }  
}
