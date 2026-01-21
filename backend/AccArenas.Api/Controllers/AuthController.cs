using System.Security.Claims;
using System.Threading.Tasks;
using AccArenas.Api.Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OpenIddict.Abstractions;
using OpenIddict.Server.AspNetCore;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace AccArenas.Api.Controllers
{
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public AuthController(
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager
        )
        {
            _signInManager = signInManager;
            _userManager = userManager;
        }

        [HttpPost("/connect/token")]
        public async Task<IActionResult> Exchange()
        {
            var form = await Request.ReadFormAsync();
            var grantType = form["grant_type"].ToString();
            if (string.IsNullOrEmpty(grantType) || grantType != GrantTypes.Password)
            {
                return BadRequest(new { error = "invalid_grant" });
            }

            var username = form["username"].ToString();
            var password = form["password"].ToString();

            var user =
                await _userManager.FindByNameAsync(username)
                ?? await _userManager.FindByEmailAsync(username);
            if (user is null)
            {
                return Forbid();
            }

            if (!await _userManager.CheckPasswordAsync(user, password))
            {
                return Forbid();
            }

            var identity = new ClaimsIdentity("Password");
            identity.AddClaim(new Claim(Claims.Subject, user.Id.ToString()));
            identity.AddClaim(new Claim(Claims.Username, user.UserName ?? string.Empty));

            var principal = new ClaimsPrincipal(identity);

            return SignIn(principal, OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
        }
    }
}
