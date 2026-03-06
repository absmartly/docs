import com.absmartly.sdk.*;

public class Example {
    static public void main(String[] args) {

        final ABsmartly sdk = ABsmartly.builder()
            .endpoint("https://your-company.absmartly.io/v1")
            .apiKey(System.getenv("ABSMARTLY_APIKEY"))
            .application("website")
            .environment("production")
            .build();
        // ...
    }
}
