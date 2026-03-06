include(FetchContent)

FetchContent_Declare(
  absmartly-sdk
  GIT_REPOSITORY https://github.com/absmartly/cpp-sdk.git
  GIT_TAG main
)
FetchContent_MakeAvailable(absmartly-sdk)

target_link_libraries(your_target PRIVATE absmartly-sdk)
