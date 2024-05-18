import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  //Variáveis
  apiUrl : string = 'http://localhost:8081/api/clientes';
  clientes : any[] = [];
  
  constructor(
    private httpClient : HttpClient
    ){
  }
  
  //objeto para desenvolver o formulario de cadastro
  formCadastro = new FormGroup({
    nomeCliente : new FormControl('',[
      Validators.required, Validators.minLength(8)
    ]),
    emailCliente : new FormControl('',[
      Validators.required, Validators.email
    ]),
    telefoneCliente : new FormControl('', [
      Validators.required, Validators.pattern(/^\d{11}$/)
    ])
  });


  //objeto para desenvolver o formulario de cadastro
  formEdicao = new FormGroup({
    idCliente : new FormControl(''),
    nomeCliente : new FormControl('', [
      Validators.required, Validators.minLength(8)]),
    emailCliente : new FormControl('', [
        Validators.required, Validators.email]),
    telefoneCliente : new FormControl('', [
      Validators.required, Validators.pattern(/^\d{11}$/)])
  });

  //Função para verificar se os campos do form estão com erro de validação e exibir uma msg
  get fCadastro(){
    return this.formCadastro.controls;
  }
 
  get fEdicao(){
    return this.formEdicao.controls;
  }

  ngOnInit(): void {
    this.httpClient.get(this.apiUrl + '/consultar').subscribe({
      next : (data) => {
        this.clientes = data as any[];
      }
    })
  }
  
  //Método para ser excutado no submit do formulario
  cadastrarCliente() : void{
    this.httpClient.post(this.apiUrl + '/criar', 
    this.formCadastro.value, {responseType : 'text'}).subscribe({//captura o retorno da api
      next : (data) => {        
        this.formCadastro.reset(); //limpando o formulario
        this.ngOnInit;
        alert(data); //exibindo msg 
      }
    })
  }

  excluirCliente(idCliente : string) : void{
    if(confirm('Deseja Excluir o Item Selecionado?')){
      this.httpClient.delete(this.apiUrl + "/excluir/" + idCliente, {responseType : 'text'})
      .subscribe({ //capturando a resposta ou retorno do método
        next : (data) => { //recebendo a msg de sucesso da API
          this.ngOnInit();
          alert(data); //exibindo a msg na tela/navegador
        }
      })
    }
  }

  //Metodo para capturar o cliente selecionado na tela e exibir os dados no form de edição
  obterCliente(c : any) : void{
    //preencher os campo do form de edição
    this.formEdicao.controls['idCliente'].setValue(c.idCliente);
    this.formEdicao.controls['nomeCliente'].setValue(c.nomeCliente);
    this.formEdicao.controls['emailCliente'].setValue(c.emailCliente);
    this.formEdicao.controls['telefoneCliente'].setValue(c.telefoneCliente);
  }

  //Metodo para enviar requisição para o endpoint de edição
  atualizarCliente() : void{
    //Executando uma chama PUT para API
    this.httpClient.put(this.apiUrl + "/editar", this.formEdicao.value, {responseType : 'text'})
    .subscribe({
      next : (data) => {
        this.ngOnInit();
        alert (data);
      }
    });
  }

}
