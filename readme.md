It looks like you want to complete the commands for database migration and upgrade in Flask with Flask-Migrate (which uses Alembic). Here are the correct commands:

### **Initialize the database**  
```bash
flask db init
```

### **Generate a new migration script**  
```bash
flask db migrate -m "Initial migration"
```

### **Apply the migration (upgrade the database schema)**  
```bash
flask db upgrade
```

This will create the necessary tables and schema in your database. Let me know if you need more details! 🚀