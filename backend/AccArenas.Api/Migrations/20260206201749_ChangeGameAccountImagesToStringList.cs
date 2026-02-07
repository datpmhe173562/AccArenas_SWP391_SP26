using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AccArenas.Api.Migrations
{
    /// <inheritdoc />
    public partial class ChangeGameAccountImagesToStringList : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Images",
                table: "GameAccounts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Image",
                table: "Categories",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Images",
                table: "GameAccounts");

            migrationBuilder.DropColumn(
                name: "Image",
                table: "Categories");
        }
    }
}
