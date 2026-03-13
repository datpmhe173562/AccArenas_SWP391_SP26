using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AccArenas.Api.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SalesInquiries : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AssignedToSalesId",
                table: "Orders",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FulfillmentStatus",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "FulfillmentEvents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OrderId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedByUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FulfillmentEvents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FulfillmentEvents_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FulfillmentEvents_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Inquiries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OrderId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CustomerUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Subject = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Inquiries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Inquiries_AspNetUsers_CustomerUserId",
                        column: x => x.CustomerUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Inquiries_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "InquiryMessages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InquiryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SenderUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SenderRole = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InquiryMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InquiryMessages_AspNetUsers_SenderUserId",
                        column: x => x.SenderUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_InquiryMessages_Inquiries_InquiryId",
                        column: x => x.InquiryId,
                        principalTable: "Inquiries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Orders_AssignedToSalesId",
                table: "Orders",
                column: "AssignedToSalesId");

            migrationBuilder.CreateIndex(
                name: "IX_FulfillmentEvents_CreatedByUserId",
                table: "FulfillmentEvents",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FulfillmentEvents_OrderId",
                table: "FulfillmentEvents",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Inquiries_CustomerUserId",
                table: "Inquiries",
                column: "CustomerUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Inquiries_OrderId",
                table: "Inquiries",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_InquiryMessages_InquiryId",
                table: "InquiryMessages",
                column: "InquiryId");

            migrationBuilder.CreateIndex(
                name: "IX_InquiryMessages_SenderUserId",
                table: "InquiryMessages",
                column: "SenderUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_AspNetUsers_AssignedToSalesId",
                table: "Orders",
                column: "AssignedToSalesId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_AspNetUsers_AssignedToSalesId",
                table: "Orders");

            migrationBuilder.DropTable(
                name: "FulfillmentEvents");

            migrationBuilder.DropTable(
                name: "InquiryMessages");

            migrationBuilder.DropTable(
                name: "Inquiries");

            migrationBuilder.DropIndex(
                name: "IX_Orders_AssignedToSalesId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "AssignedToSalesId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "FulfillmentStatus",
                table: "Orders");
        }
    }
}
