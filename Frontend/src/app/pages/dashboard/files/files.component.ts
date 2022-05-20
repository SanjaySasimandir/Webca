import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FolderModel, foldersModel } from 'src/app/models/file.model';
import { UserauthService } from 'src/app/services/userauth.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { NewFolderDialogComponent } from './new-folder-dialog/new-folder-dialog.component';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<FilesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private webSocket: WebSocketService,
    private http: HttpClient,
    private userauthService: UserauthService) { }

  selectedChannel: any;
  selectedFolder!: FolderModel;



  uploadedFile: Array<File> = [];
  fileSelected(element: any) {
    this.uploadedFile = element.target.files;
    this.uploadFile();
  }

  uploadFile() {
    let formData = new FormData();
    let splitname = this.uploadedFile[0].name.split('.');
    let filetype = splitname[splitname.length - 1];
    formData.append("uploads[]", this.uploadedFile[0], JSON.stringify({
      "username": localStorage.getItem('username'),
      "filename": this.uploadedFile[0].name,
      "channelid": this.selectedChannel.channelid,
      "filetype": filetype,
      "folderid": this.selectedFolder._id,
      "token": localStorage.getItem('token'),
    }) + '|&&&|' + this.uploadedFile[0].name);
    this.http.post(this.userauthService.server_address + 'files/uploadfile', formData).subscribe((status: any) => {
      if (status.message == 'success') {
        this.loadFolder(this.selectedFolder._id);
      }
    });
  }


  /*downloadFile(filelocation: String) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    })
    // this.http.get(this.userauthService.server_address + 'files/getFile/yXGFj8jH_RaMHJhOCT-KcHZ7.zvwVXyBscNglQkn6.jpg', {
    //   responseType: 'arraybuffer', headers: headers,
    // }

    this.http.get(this.userauthService.server_address + 'files/getFile/' + filelocation, {
      responseType: 'arraybuffer', headers: { 'Authorization': `${localStorage.getItem('token')}` }
    }
    ).subscribe(response => this.startdownloadFile(response, 'text/plain'));

  }
  startdownloadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert('Please disable your Pop-up blocker and try again.');
    }
  }*/

  downloadFile(filelocation: string){

    let token = "" + localStorage.getItem('token')
    const headers = new HttpHeaders().set('authorization', token);
    this.http.get(this.userauthService.server_address + 'files/getFile/' + filelocation, { headers, responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        let dataType = response.type;
        console.log(dataType)
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
        if (filelocation)
          downloadLink.setAttribute('download', filelocation);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.parentNode!.removeChild(downloadLink);
      }
    )
  }

  createFolder() {
    this.dialog.open(NewFolderDialogComponent, {
      data: {
        "folderid": this.selectedFolder._id,
        "folders": this.selectedFolder.folders,
        "channelid": this.selectedChannel.channelid,
      }
    });
    this.refreshParentFolder();
  }

  getMainFolder() {
    this.webSocket.emit('get main folder trigger', { "channelid": this.selectedChannel.channelid });
  }


  loadFolder(folderid: any) {
    this.webSocket.emit('get folder trigger', { "folderid": folderid });
    this.webSocket.listenOnce('get folder').subscribe((res: any) => {
      this.selectedFolder = res;
    });
  }

  refreshParentFolder() {
    this.webSocket.listenOnce('refresh parent folder').subscribe((res: any) => {
      this.selectedFolder = res;
      this.webSocket.off('refresh parent folder');
    });
  }


  previous_folder_ids: String[] = [];
  openFolder(folder: foldersModel) {
    this.previous_folder_ids.push(this.selectedFolder._id);
    this.loadFolder(folder.folderid);
  }

  goBack() {
    this.loadFolder(this.previous_folder_ids.pop());
  }

  displayedColumns: string[] = ['icon', 'name', 'author', 'uploadDate'];
  displayedColumnsForFolders: string[] = ['icon', 'name'];
  socketListeners() {
    this.webSocket.listenOnce('get main folder').subscribe((res: any) => {
      this.selectedFolder = res;
    });
  }

  ngOnInit(): void {
    this.selectedChannel = this.data.selectedChannel;
    this.socketListeners();
    this.getMainFolder();
  }

  ngOnDestroy(): void {

  }

}
