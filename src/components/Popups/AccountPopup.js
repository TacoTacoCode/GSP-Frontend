import React, { useState, useEffect } from 'react'
import '../../styles/Popup.scss'
import CloseIcon from '@mui/icons-material/Close'
import { Button, InputAdornment, makeStyles, MenuItem, TextField } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import axios from 'axios';
import swal from 'sweetalert';

const statuses = [
  {
    value: true,
    label: 'Active'
  },
  {
    value: false,
    label: 'Inactive'
  }
]

const genders = [
  {
    value: true,
    label: 'Male'
  },
  {
    value: false,
    label: 'Female'
  }
]

const CssTextField = styled(TextField)({
  'width': '100%',
  '& label.Mui-focused': {
    color: 'black',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#bd162c',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'black',
    },
    '&:hover fieldset': {
      borderColor: '#bd162c',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#bd162c',
    },
  },
});


function AccountPopup(props) {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [accountID, setAccountID] = useState(0);
  const [accountName, setAccountName] = useState('');
  const [password, setAccountPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setAccountEmail] = useState('');
  const [gender, setAccountGender] = useState(true);
  const [dateOfBirth, setAccountDateOfBirth] = useState(null);
  const [address, setAccountAddress] = useState('');
  const [phone, setAccountPhone] = useState('');
  const [roleID, setAccountRole] = useState('');
  const [sectionID, setAccountSection] = useState('');

  const [isActive, setStatus] = useState(true);

  const [roles, setRoleList] = useState([]);
  const [sections, setSectionList] = useState([]);

  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");

  const handlePreviewAvatar = (e) => {
    const file = e.target.files[0];
    file.preview = URL.createObjectURL(file);
    setAvatarUrl(file);
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  //đổi ảnh khác thì clean bộ nhớ
  useEffect(() => {
    //clean up function for avatarUrl
    return () => {
      return avatarUrl && URL.revokeObjectURL(avatarUrl.preview);
    }
  }, [avatarUrl])

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}getRoles`).then(res => {
      let allRole = []
      res.data.map(e => e.roleId != 'ADM' ? allRole.push(e) : null)
      setRoleList(allRole)
    });
    axios.get(`${process.env.REACT_APP_API_URL}getAllSections`).then(res => {
      setSectionList(res.data)
    });
  }, [])

  const postData = (e) => {
    // uploadFile().then(res => {
    //   //get the return avatarURL then parse it to object POST
    // })
    const jsonObj = {
      accountId: accountID,
      password,
      email,
      name: accountName,
      gender,
      dateOfBirth: new Date(dateOfBirth).toISOString(), //convert to ISO string
      address,
      phone,
      avatarUrl: "string", //parse url here
      roleId: roleID,
      sectionId: sectionID,
      isActive: isActive ? true : false
    }

    //lúc trước khi gửi dữ liệu thì nên có hàm check những trường dữ liệu bắt buộc nha (bên table nữa)
    axios.post(`${process.env.REACT_APP_API_URL}addAccount`, jsonObj).then(res => {
      swal("Success", "Add new account successfully", "success", {
        buttons: false,
        timer: 2000,
      })

      //reset data
      handleCancelClick();
    }).catch(err => {
      swal("Error", "Add new account failed", "error", {
        buttons: false,
        timer: 2000,
      })
      console.log(err)
    }).finally(function () {
      handleDelay();
    });
  }

  const postData2 = (e) => {
    const formData = new FormData();
    formData.append("accountId", accountID);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("name", accountName);
    formData.append("gender", gender);
    formData.append("dateOfBirth", new Date(dateOfBirth).toISOString());
    formData.append("address", address);
    formData.append("phone", phone);
    formData.append("roleId", roleID);
    if (sectionID != null) {
      formData.append("sectionId", sectionID);
    }
    formData.append("isActive", isActive);
    if (file != null) {
      formData.append("file", file);
    }
    axios.post(`${process.env.REACT_APP_API_URL}addAccount`, formData)
      .then(res => {
        swal("Success", "Add new account successfully", "success", {
          buttons: false,
          timer: 2000,
        })
        //reset data
        handleCancelClick();
      }).catch(err => {
        swal("Error", "Add new account failed", "error", {
          buttons: false,
          timer: 2000,
        })
        console.log(err)
        window.location.reload();
      }).finally(() => {
        window.location.reload();
      });
  }
  const handleCancelClick = () => {
    //reset all value when cancel submit (not include close popup function)
    //React 18 said that when React.lifecycle ended then all state change would be update, not updateed one by one like before
    setAccountID('');
    setAccountName('');
    setAccountPassword('');
    setAccountEmail('');
    setAccountGender(true);
    setAccountDateOfBirth(null);
    setAccountAddress('');
    setAccountPhone('');
    setAccountRole('');
    setAccountSection('');
    setStatus(true);
    setAvatarUrl('');
    setFile('');
    setFileName('');
    props.setTrigger(false)
  }

  var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();

  const handleDelay = () => {
    delay(function () { window.location.reload(); }, 1000);
  };


  return (props.trigger) ? (
    // <div className='Accountpopup'>
    <div className='popup-inner'>
      {/* <div><button className='close-btn' onClick={() => props.setTrigger(false)}>
          <CloseIcon style={{ 'color': "white", }} /> 
        </button></div> */}
      {props.children}
      <div className="popup-body" style={{ height: '650px', overflow: 'auto', overflowY: 'scroll', overflowX: 'hidden' }}>
        <form>
          <div className='account-popup'>
            <div style={{ fontFamily: 'Muli', fontSize: '18px' }} className='account-imagefield'>
              <div style={{ display: 'inline' }}>
                <div style={{ display: 'inline-block' }}>
                  <p style={{ marginBottom: '5%' }}>Profile Picture</p>
                  <input style={{ fontFamily: 'Muli', fontSize: '18px', width: '100%', display: 'inline-block' }} type="file" onChange={handlePreviewAvatar} />
                </div>
                <div style={{ display: 'inline-block', paddingLeft: '2%' }}>{avatarUrl ? <img src={avatarUrl.preview} alt='avatar' width="100px" /> : null}</div>
              </div>
            </div>
            <div className='account-row-1'>
              <div className='account-name'>
                <CssTextField label="Account Name" value={accountName} required onChange={(e) => setAccountName(e.target.value)} />
              </div>
              <div className='account-gender'>
                <CssTextField
                  label="Gender"
                  select
                  value={gender}
                  required
                  onChange={(e) => setAccountGender(e.target.value)}
                  helperText="Choose gender"
                >
                  {genders.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </CssTextField>
              </div>
              <div className='account-gender'>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date of Birth"
                    inputFormat="dd/MM/yyyy"
                    selected={dateOfBirth}
                    onChange={(e) => setAccountDateOfBirth(e)}
                    value={dateOfBirth}
                    onSelect={(e) => setAccountDateOfBirth(e)}
                    renderInput={(params) => <CssTextField {...params} />}
                  />
                </LocalizationProvider>
              </div>

            </div>
            <div className='account-row-2'>
              <div className='account-name'>
                <CssTextField label="Password" type={'password'} value={password} required onChange={(e) => setAccountPassword(e.target.value)} />
              </div>
              <div className='account-name'>
                <CssTextField
                  label="Confirm Password" type={'password'}
                  value={confirmPassword} id="fullWidth" required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  helperText={password != confirmPassword ? 'Password and Confirm password does not match' : ''} />
              </div>
            </div>
            <div className='account-row-2'>
              <div className='account-phone'>
                <CssTextField
                  label="Phone"

                  value={phone}
                  required type={'tel'}
                  InputProps={{
                    inputProps: { min: 0, max: 11, pattern: '[0-9]*' }
                  }}
                  onChange={(e) => setAccountPhone(e.target.value)} />
              </div>
              <div className='account-status'>
                <CssTextField
                  label="Status"
                  select
                  value={isActive}
                  required
                  onChange={(e) => setStatus(e.target.value)}
                  helperText="Choose Account status"
                >
                  {statuses.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </CssTextField>
              </div>
            </div>
            <div className='account-address'>
              <CssTextField label="Address" value={address} required onChange={(e) => setAccountAddress(e.target.value)} />
            </div>
            <div className='account-row-3'>
              <div className='account-phone'>
                <CssTextField label="Email" type={'email'} value={email} required onChange={(e) => setAccountEmail(e.target.value)} />
              </div>
              <div className='account-gender'>
                <CssTextField
                  label="Role"
                  select
                  value={roleID}
                  required
                  onChange={(e) => setAccountRole(e.target.value)}
                  helperText="Choose Role"
                >
                  {roles.map((option) => (
                    <MenuItem key={option.roleId} value={option.roleId}>
                      {option.name}
                    </MenuItem>
                  ))}
                </CssTextField>
              </div>

              <div className='account-gender'>
                <CssTextField
                  label="Section"
                  select
                  value={sectionID}
                  required
                  onChange={(e) => setAccountSection(e.target.value)}
                  helperText="Choose Section"
                >
                  {sections.map((option) => (
                    <MenuItem key={option.sectionId} value={option.sectionId}>
                      {option.sectionId}
                    </MenuItem>
                  ))}
                </CssTextField>
              </div>
            </div>

            <div className='btngr'>
              <Button
                variant="contained"
                style={{ fontFamily: 'Muli', borderRadius: 10, backgroundColor: "#bd162c", marginRight: '0.5rem' }}
                size="large" onClick={postData2}>Add Account</Button>
              <Button
                variant="contained"
                style={{ fontFamily: 'Muli', borderRadius: 10, backgroundColor: "#bd162c" }}
                size="large" onClick={handleCancelClick}
              >Cancel</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
    // </div>
  ) : "";
}


export default AccountPopup