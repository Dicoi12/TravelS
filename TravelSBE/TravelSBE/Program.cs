using Microsoft.EntityFrameworkCore;
using TravelSBE.Data;
using TravelSBE.Services;
using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using TravelSBE;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Adaugă serviciile la container.
        builder.Services.AddControllers();
        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
        builder.Services.AddAutoMapper(typeof(Program));

        // Register your services here
        builder.Services.AddScoped<IObjectiveService, ObjectiveService>();

        // Configurarea aplicației
        var app = builder.Build();

        // Configurează pipeline-ul HTTP request.
        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseHttpsRedirection();
        app.UseAuthorization();
        app.MapControllers();
        app.Run();
    }
}