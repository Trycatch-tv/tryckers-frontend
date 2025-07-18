import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { User, UserService } from '../../services/users.service';
import { ImportsModule } from '../../imports';

@Component({
    selector: 'app-tryckers',
    standalone: true,
    imports: [ImportsModule],
    templateUrl: './tryckers.html',
    providers: [MessageService, UserService, ConfirmationService, FormsModule, ReactiveFormsModule]
})
export class Tryckers implements OnInit {
    userDialog: boolean = false;

    users = signal<Partial<User>[]>([]);
    user!: User;
    selectedUsers!: User[] | null;

    submitted: boolean = false;
    @ViewChild('dt') dt!: Table;

    constructor(
        private userService: UserService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadDemoData();
    }

    loadDemoData() {
        this.userService._getUsers().then((data) => {
            this.users.set(data);
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.user = {} as User;
        this.submitted = false;
        this.userDialog = true;
    }

    editUser(u: User) {
        this.user = { ...u };
        this.userDialog = true;
    }

    deleteSelectedUsers() {
        this.confirmationService.confirm({
            message: 'Estas seguro de eliminar los usuarios seleccionados?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.users.set(this.users().filter((val) => !this.selectedUsers?.includes(val as User)));
                this.selectedUsers = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exito',
                    detail: 'Usuarios eliminados',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    }

    deleteUser(user: User) {
        this.confirmationService.confirm({
            message: 'Estas seguro de eliminar a ' + user.Name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.users.set(this.users().filter((val) => val.ID !== user.ID));
                this.user = {} as User;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exito',
                    detail: 'Usuario eliminado',
                    life: 3000
                });
            }
        });
    }

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.users().length; i++) {
            if (this.users()[i].ID === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    saveUser() {
        this.submitted = true;
        let _users = this.users();
        if (this.user.ID) {
            // TODO: actualizar usando servicio
            // this.userService.updateUser(this.user).subscribe((data) => {
            //     _users[this.findIndexById(this.user.ID)] = this.user;
            //     this.users.set([..._users]);
            //     this.messageService.add({
            //         severity: 'success',
            //         summary: 'Exito',
            //         detail: 'Usuario actualizado',
            //         life: 3000
            //     });
            // });
        } else {
            // TODO: crear usando servicio
            // this.userService.createUser(this.user).subscribe((data) => {
            //     _users[this.findIndexById(this.user.ID)] = this.user;
            //     this.users.set([..._users]);
            //     this.messageService.add({
            //         severity: 'success',
            //         summary: 'Exito',
            //         detail: 'Usuario creado',
            //         life: 3000
            //     });
            // });
            // this.messageService.add({
            //     severity: 'success',
            //     summary: 'Successful',
            //     detail: 'Product Created',
            //     life: 3000
            // });
            // this.users.set([..._users, this.user]);
        }

        this.userDialog = false;
        this.user = {} as User;
    }
}
