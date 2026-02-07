using System;
using System.Text;
using AccArenas.Api.Application.Exceptions;
using AccArenas.Api.Application.Services;
using AccArenas.Api.Domain.Interfaces;
using AccArenas.Api.Domain.Models;
using AccArenas.Api.Infrastructure.Data;
using AccArenas.Api.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OpenIddict.Abstractions;
using OpenIddict.Validation.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowFrontend",
        policy =>
        {
            policy
                .WithOrigins(
                    "http://localhost:3000",
                    "http://localhost:3001",
                    "https://localhost:3000",
                    "https://localhost:3001"
                )
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        }
    );
});

// Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(connectionString);
    options.UseOpenIddict();
});

// Repository Pattern & Unit of Work
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Register specific repositories
builder.Services.AddScoped<IBannerRepository, BannerRepository>();
builder.Services.AddScoped<IBlogPostRepository, BlogPostRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IFeedbackRepository, FeedbackRepository>();
builder.Services.AddScoped<IGameAccountRepository, GameAccountRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IPromotionRepository, PromotionRepository>();
builder.Services.AddScoped<ISliderRepository, SliderRepository>();

// Register generic repository for any additional entities
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// JWT Service
builder.Services.AddScoped<IJwtService, JwtService>();

// Email Service
builder.Services.AddScoped<IEmailService, EmailService>();

// Mapping Service
builder.Services.AddScoped<IMappingService, MappingService>();

// AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

// JWT Authentication Configuration
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey =
    jwtSettings["SecretKey"] ?? "AccArenas-Super-Secret-Key-For-JWT-Token-Generation-2026";

builder
    .Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false; // Set to true in production
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
            ValidateIssuer = true,
            ValidIssuer = jwtSettings["Issuer"] ?? "AccArenas",
            ValidateAudience = true,
            ValidAudience = jwtSettings["Audience"] ?? "AccArenas-Users",
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,
            // Map Microsoft's long claim names to short names
            RoleClaimType = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
            NameClaimType = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        };
    });

// Identity Core (without cookies, we use JWT Bearer)
builder
    .Services.AddIdentityCore<ApplicationUser>(options =>
    {
        options.Password.RequireDigit = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequiredLength = 6;
        options.User.RequireUniqueEmail = true;
        options.SignIn.RequireConfirmedEmail = false;
    })
    .AddRoles<ApplicationRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddSignInManager<SignInManager<ApplicationUser>>()
    .AddDefaultTokenProviders();

// Configure Identity to NOT use cookies (we use JWT Bearer only)
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.Name = "AccArenas.Identity";
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        return Task.CompletedTask;
    };
    // Disable cookie authentication completely for API
    options.LoginPath = null;
    options.LogoutPath = null;
    options.AccessDeniedPath = null;
});

// OpenIddict (Identity Server) - Commented out, using JWT Bearer instead
// builder
//     .Services.AddOpenIddict()
//     .AddCore(options =>
//     {
//         options.UseEntityFrameworkCore().UseDbContext<ApplicationDbContext>();
//     })
//     .AddServer(options =>
//     {
//         options.AllowPasswordFlow();
//         options.SetTokenEndpointUris("/connect/token");
//         options.AcceptAnonymousClients();
// 
//         options.AddDevelopmentEncryptionCertificate().AddDevelopmentSigningCertificate();
// 
//         options.UseAspNetCore().EnableTokenEndpointPassthrough();
//     })
//     .AddValidation(options =>
//     {
//         options.UseLocalServer();
//         options.UseAspNetCore();
//     });


var app = builder.Build();

// Global exception handling middleware
app.UseGlobalExceptionHandling();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use CORS
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Initialize database and seed data
await DbInitializer.InitializeAsync(app.Services);

app.Run();
