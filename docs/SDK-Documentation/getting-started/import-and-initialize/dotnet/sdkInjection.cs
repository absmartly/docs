using ABSmartly;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class Test : ControllerBase
{
    private readonly ABSdk \_abSdk;

    public Test(ABSdk abSdk)
    {
        _abSdk = abSdk;
    }

}
