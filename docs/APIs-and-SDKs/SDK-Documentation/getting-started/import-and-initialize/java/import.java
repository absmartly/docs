import com.absmartly.sdk.*;

public class Example {
    static public void main(String[] args) {

        final ABSmartly sdk = ABSmartly.create(
            "https://your-company.absmartly.io/v1",
            System.getenv("ABSMARTLY_APIKEY"),
            "website",
            "production"
        );
        // ...
    }
}
