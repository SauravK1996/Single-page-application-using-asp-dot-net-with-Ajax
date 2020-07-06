namespace SimpleShoppingList.Migrations
{
    using SimpleShoppingList.Models;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<SimpleShoppingList.Data.SimpleShoppingListContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(SimpleShoppingList.Data.SimpleShoppingListContext context)
        {
            context.ShoppingLists.AddOrUpdate(
                new ShoppingList  {
                    Name = "Groceries",
                    Items = { 
                        new Item { Name = "Milk"},
                        new Item { Name = "Cornflakes"},
                        new Item {  Name = "Strawberries"}
                    }
                },
                new ShoppingList {
                    Name = "Hardware"
                }
                );


        }
    }
}
