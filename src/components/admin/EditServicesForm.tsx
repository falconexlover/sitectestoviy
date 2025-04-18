            <Modal 
                isOpen={currentEditId !== null} 
                onClose={handleCancelEdit} 
                title={currentEditId === 'new' ? "Новая услуга" : "Редактировать услугу"}
            >
                <AddEditFormWrapper>
                    <h3>{currentEditId === 'new' ? "Новое преимущество" : "Редактировать преимущество"}</h3>
                    <form onSubmit={handleFormSubmit}>
                         <FormGroup>
                           <Label htmlFor="serviceName">Название преимущества*</Label>
                           <Input 
// ... existing code ... 