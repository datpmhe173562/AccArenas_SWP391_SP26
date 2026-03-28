using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AccArenas.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddFavoritesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // migrationBuilder.CreateTable(
            //     name: "AuditLogs",
            //     columns: table => new
            //     {
            //         Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
            //         UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
            //         Action = table.Column<string>(type: "nvarchar(max)", nullable: false),
            //         EntityType = table.Column<string>(type: "nvarchar(max)", nullable: false),
            //         EntityId = table.Column<string>(type: "nvarchar(max)", nullable: false),
            //         Details = table.Column<string>(type: "nvarchar(max)", nullable: false),
            //         CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
            //     },
            //     constraints: table =>
            //     {
            //         table.PrimaryKey("PK_AuditLogs", x => x.Id);
            //         table.ForeignKey(
            //             name: "FK_AuditLogs_AspNetUsers_UserId",
            //             column: x => x.UserId,
            //             principalTable: "AspNetUsers",
            //             principalColumn: "Id",
            //             onDelete: ReferentialAction.Restrict);
            //     });

            migrationBuilder.CreateTable(
                name: "Favorites",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GameAccountId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Favorites", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Favorites_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Favorites_GameAccounts_GameAccountId",
                        column: x => x.GameAccountId,
                        principalTable: "GameAccounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            // migrationBuilder.CreateIndex(
            //     name: "IX_AuditLogs_UserId",
            //     table: "AuditLogs",
            //     column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Favorites_GameAccountId",
                table: "Favorites",
                column: "GameAccountId");

            migrationBuilder.CreateIndex(
                name: "IX_Favorites_UserId",
                table: "Favorites",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // migrationBuilder.DropTable(
            //     name: "AuditLogs");

            migrationBuilder.DropTable(
                name: "Favorites");
        }
    }
}
