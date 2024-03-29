import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor() { }
  public stream!: MediaStream;
  public isMute = new BehaviorSubject(false);
  public isCameraOff = new BehaviorSubject(false);
  public mode: 'view' | 'owner' = 'view';

  public muteOrUnMute(): void {
    if (this.stream) {
      this.isMute.next(!this.isMute.getValue());
      this.stream.getAudioTracks()[0].enabled = !this.isMute.getValue();
    }
  }
  public turnVideoOnOrOff(): void {
    if (this.stream) {
      this.isCameraOff.next(!this.isCameraOff.getValue());
      this.stream.getVideoTracks()[0].enabled = !this.isCameraOff.getValue();
    }
  }

  /*public getMicSrc(): string {
    if (this.mode === 'owner') {
      return this.isMute.getValue() ? MediaIconUrl.micMuteIconUrl : MediaIconUrl.micIconUrl;
    }
    return this.isMute.getValue() ? MediaIconUrl.soundOffIconUrl : MediaIconUrl.soundIconUrl;
  }

  public getWebcamSrc(): string {
    return this.isCameraOff.getValue() ? MediaIconUrl.cameraOffIconUrl : MediaIconUrl.cameraIconUrl;
  }*/

  public getMicSrc(): string {
    if (this.mode == 'owner') {
      return this.isMute.getValue() ? MediaIcon.micOff : MediaIcon.micOn;
    }
    return this.isMute.getValue() ? MediaIcon.soundOff : MediaIcon.soundOn;
  }

  public getWebcamSrc(): string {
    return this.isCameraOff.getValue() ? MediaIcon.camOff : MediaIcon.camOn;
  }
}

export const MediaIconUrl = {
  micIconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABGUlEQVRIie2VQU7CUBCGP1kjsodEEbwAJLhgYTyAB3KD9/AGpoGwRxK4A1eAhVAj9QB18ebJ2JTHkHal/snkvUzn//9OM5mCDU0gAhKJEXBj5JrEYyDNRAw0yjCIcsR9vJRhkAQMPo6RzwwGaRGNisGgEP4N/qDBJ24sz1UuCfB36l4T7o/6rMFazrbKvQYMpurekXMVMljI+aByj7i9k8W7PPPwnEVO7TfucW2+4Vr2aOD2zk4iUm8MUAe2wr0LGQDMpXCEbQgqwEQ4M0M9V7j2U2AMXARq60o8Bi4tBgC37P8BG2AIdIEqbsJ6wBP7z7IF+lZxj2vcBB1a1T6mQOtUcY0B8AwslehScoMiwnnwBmb8vl1UOr4ADzlTDz/nXjoAAAAASUVORK5CYII=',
  micMuteIconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABhElEQVRIid3VwUsVURTH8c/zCQqFIvGEoEcUhA9CsnCrkfU3hP9L6/6UNiUErWrhLjelGw1SW4WL0DJI4RUZ1OKeqWF4M84kgviDCzNz7vl9zz137gznSa/xFpMDYl0s4SDGc0w1BaziNzYKkC72I5YfXyNWWx2sR/J7XI7nSwPMs/G06SoGQQ4qAN+aAgZBysyz8V/KQ04F0ARyInVOCmjVgBxnUukxVANwWBE79i0qA+SrWq7If1WSU6k5LKIX91PSqS32/hfuxJxe5MwVzYorGMWVqGYGl7CFW3gmHbpDqTVtPMHNmNuK3NEqwA/sxnUL8wHZwUOMYww3pG9WT2rTROTshsdftYtLwh6uR2wY13ABP6W2tKPKd1FAF7exgpc4ypuVbcwE7mGkJJ5pDI8C8gF38akOAC5i1r+vapn6eCztxSYW8pA6r1YHV6W+57WNj/gSc5YxXYTUOWifpZ9Rv1D1Wphncx5I+9LDi2xiHUCmN2Hcj+ui9nA/ivnewPeM6w8+/IScPJeSrgAAAABJRU5ErkJggg==',
  cameraIconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAzElEQVRIie2USw6CMBCGP12wgdO4V7yIO/cmJnKGeg6WPuKlwFNIXXRMVPrSutDInzQ0/Zn5pp0C/IMqQDtGlZp8AXQeQAcsfQlGd3OdWo0t9/jDSXv6GsAemAGFjBI4vgpzNXLliVl74qIAO/EyYAu0QAMoWUN28jZgKp6yeEq8MgWQi9davLN4hQ8QavLtO7FVdInJEQJM5FlbvPrpnaBs2zyIl2HOvKHf5JMjNgqgMVfRpY0nLhqgMVdxjml6LnNX5Q+A4Wc36Ad0BaylfKD5mysrAAAAAElFTkSuQmCC',
  cameraOffIconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABJElEQVRIid3UO0rEQBgA4A87FTsDdgraiAg2tqvtgl5AFBHcQtDGE1h6mbV0Kw9ga2MpuEcQFPERi4zskE3WxOxa+MPAMI98889Mhv8US+hhIdd+gbSkXNYBemHSHZLQtoa3EUAaFlApDqJJMbKH9x+QuPTRLgIecgNj5BAfNZDHIqBo4L3BmRzVRCoB+UxmMIsWuuMC8sg0lkP9vClwGz6eRzo4DfWrJsAONkoy6WAVW02AJKy0bLvmQikFpoqkKF7wmmtbx01AnvBZtuIqGbRkT8hzQV+cyUkE1dqibujb/wVSCUhlVxEWcYwzbCq+XTFSGUhlV3Fb9pPNY1d2hUdlUguoUvLIUPTHjAxFW/YKThRpEonBwfcmAXwj11iZFPD38QUC9gVl/dtF3AAAAABJRU5ErkJggg==',
  soundIconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABEUlEQVRIieXVP0oDQRiG8Z+SMoXYxQsEKy0srCyCYC1YWXgHzyF2nkDESkinBP+g1l4goKWxE+sgxGJ3UcbZTWZ1QfCBKYZh3me/2fl2+Y+0mwzv4iRlw3xi+A06TQiK8KWU8FkFy7jFHJ4i620cYSFVXoS/YCSr4g7XQfg9xtiKBbSC+SoOgvkYPQwje8+xjl0MYoLwiBax6bPch5JweEc/Dz+LhcfoYYKNkvXwiKaSck3L2MPll7Hy24JKwpdch+N8RCmr4FBW7oXsepaxj50qeyh4xRXe8vmarINjkha2cTpNUkXRaM9qNlqq5NH3a/qjT0VBNxdMIoJKZr2mQ1kTjtKeK60PaktSafSX+ff4AGpjNL4njw0PAAAAAElFTkSuQmCC',
  soundOffIconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAkElEQVRIie2Suw2AMAwFHzADESvCArSMRsMCUDBOKDCSZZmggC1R5Ko4tt4pH6BgzOQdHr3DXQQ83Fwgw00FWrgU9AACqwPtqWhhKcFA9UbBgdaRep8FPHATa36q1wIAaAGsrLcD6PhArZk+Ut01fndF2Y8sMf+mGuODwAQpcYFL3LgkWTQZswvOPz7nSgpJDrQEcJ0HwMYYAAAAAElFTkSuQmCC',
}

export const MediaIcon = {
  micOn: 'mic',
  micOff: 'mic_off',
  camOn: 'videocam',
  camOff: 'videocam_off',
  soundOn: 'volume_up',
  soundOff: 'volume_off'
}