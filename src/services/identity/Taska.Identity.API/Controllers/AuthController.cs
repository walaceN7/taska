using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Taska.Identity.Application.Features.RefreshTokens.Commands;
using Taska.Identity.Application.Features.Users.Commands;
using Taska.Identity.Domain.Exceptions;

namespace Taska.Identity.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IMediator mediator) : ControllerBase
{

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterCommand command)
    {
        var result = await mediator.Send(command);

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = result.RefreshTokenExpiresAt
        };
        Response.Cookies.Append("taska_refresh_token", result.RefreshToken, cookieOptions);

        return Ok(new
        {
            message = "Usuário registrado com sucesso. Criando workspace...",
            user = result.User,
            accessToken = result.AccessToken
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        var result = await mediator.Send(command);
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = result.RefreshTokenExpiresAt
        };

        Response.Cookies.Append("taska_refresh_token", result.RefreshToken, cookieOptions);

        return Ok(new
        {
            message = "Login realizado com sucesso",
            user = result.User,
            accessToken = result.AccessToken
        });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {        
        var refreshToken = Request.Cookies["taska_refresh_token"];

        if (string.IsNullOrEmpty(refreshToken))
            throw new UnauthorizedException("Refresh token not found.");
             
        var result = await mediator.Send(new RefreshTokenCommand(refreshToken));
                
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = result.RefreshTokenExpiresAt
        };
                
        Response.Cookies.Append("taska_refresh_token", result.RefreshToken, cookieOptions);
                
        return Ok(new
        {
            accessToken = result.AccessToken
        });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var refreshToken = Request.Cookies["taska_refresh_token"];

        if (!string.IsNullOrEmpty(refreshToken))
        {            
            await mediator.Send(new LogoutCommand(refreshToken));
        }
        
        Response.Cookies.Delete("taska_refresh_token");

        return NoContent();
    }

    [HttpGet("me")]
    [Authorize]
    public IActionResult Me()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var email = User.FindFirst(ClaimTypes.Email)?.Value;
        return Ok(new { userId, email });
    }

    [HttpPost("register/invite")]
    public async Task<IActionResult> RegisterWithInvitation([FromBody] RegisterWithInvitationCommand command)
    {
        var result = await mediator.Send(command);

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = result.RefreshTokenExpiresAt
        };
        Response.Cookies.Append("taska_refresh_token", result.RefreshToken, cookieOptions);

        return Ok(new
        {
            message = "Conta criada e convite aceito com sucesso.",
            user = result.User,
            accessToken = result.AccessToken
        });
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordCommand command)
    {
        await mediator.Send(command);
        return Ok(new { message = "If the email is registered, a reset link has been sent." });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordCommand command)
    {
        await mediator.Send(command);
        return Ok(new { message = "Password has been reset successfully." });
    }

    [HttpGet("2fa/setup")]
    [Authorize]
    public async Task<IActionResult> SetupTwoFactor()
    {
        var result = await mediator.Send(new SetupTwoFactorCommand());
        return Ok(result);
    }

    [HttpPost("2fa/enable")]
    [Authorize]
    public async Task<IActionResult> EnableTwoFactor([FromBody] EnableTwoFactorCommand command)
    {
        await mediator.Send(command);
        return Ok(new { message = "Two-factor authentication enabled successfully." });
    }

    [HttpPost("login/2fa")]
    public async Task<IActionResult> VerifyTwoFactor([FromBody] VerifyTwoFactorCommand command)
    {
        var result = await mediator.Send(command);

        var refreshCookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = result.RefreshTokenExpiresAt
        };
        Response.Cookies.Append("taska_refresh_token", result.RefreshToken, refreshCookieOptions);

        if (!string.IsNullOrEmpty(result.DeviceToken))
        {
            var deviceCookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(30)
            };
            Response.Cookies.Append("taska_device_token", result.DeviceToken, deviceCookieOptions);
        }

        return Ok(new
        {
            message = "Login successful",
            user = result.User,
            accessToken = result.AccessToken
        });
    }
}
