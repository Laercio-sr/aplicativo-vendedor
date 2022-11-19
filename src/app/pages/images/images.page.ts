import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AlertController, LoadingController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { Clipboard } from '@ionic-native/clipboard/ngx';

import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-images',
  templateUrl: './images.page.html',
  styleUrls: ['./images.page.scss'],
})
export class ImagesPage {
  name:string;
  items: Observable<any[]>;
  nameImg: string = '';
  itemsRef: AngularFirestoreCollection;
  selectedFile: any;
  loading: HTMLIonLoadingElement;
  pasteText:string = "";
  subscription:Subscription
  public images;
  private imageSubscription: Subscription;
  myform: FormGroup;

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private router: Router,
    private loadingController: LoadingController,
    public alertController: AlertController,
    private clipboard: Clipboard
  ) {
    this.itemsRef = db.collection('items')
    this.items = this.itemsRef.valueChanges();
  }

 
  async imageFilter(imageSearch){
    let val = imageSearch.target.value.toLowerCase();
    if(val && val.trim() != ''){
      this.images = this.images.filter((image) => { 
        return (image.title.toLowerCase().indexOf(val) > -1);
      })
    } else {
     
    }
  }

  copyInputMessage(inputElement){
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }  

  textPaste() {
    this.clipboard.paste().then((text) => {
         this.pasteText = text;
         console.log("paste done.");
       })
  }

  clearCopy() {
    this.clipboard.clear().then(() => {
      console.log("copy clear.");
    })
  }

  chooseFile (event) {
    this.selectedFile = event.target.files
  }

  addImg(){
    this.itemsRef.add({
      title: this.nameImg
    })
    .then(async resp => {
      const imageUrl = await this.uploadFile(resp.id, this.selectedFile)
      this.itemsRef.doc(resp.id).update({
        id: resp.id,
        imageUrl: imageUrl || null
      })
    }).catch(error => {
      console.log(error);
    })
  }

  async uploadFile(id, file): Promise<any> {
    if(file && file.length) {
      try {
        await this.presentLoading();
        const task = await this.storage.ref('images').child(id).put(file[0])
        this.loading.dismiss();
        return this.storage.ref(`images/${id}`).getDownloadURL().toPromise();
      } catch (error) {
        console.log(error);
      }
    }
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Carregando...'
    });
    return this.loading.present();
  }  

  async delete(item) {
    const alert = await this.alertController.create({
      header: 'Atenção!',
      message: 'Deseja realmente <strong>Ecluir</strong> está imagem?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            return;
          }
        }, {
          text: 'Excluir',
          handler: () => {
            console.log(item);
            if(item.imageUrl) {
              this.storage.ref(`images/${item.id}`).delete()
            }
            this.itemsRef.doc(item.id).delete()
            this.router.navigate(['/images']);
            this.confirmDelete();
          }
        }
      ]
    });
    await alert.present();
  }

  async confirmDelete() {
    const alert = await this.alertController.create({
      header: 'Imagem excluída com sucesso!',
      buttons: [
        {
          text: 'OK',         
        }
      ]
    });
    await alert.present();
  }

}
