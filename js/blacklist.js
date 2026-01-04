// Email domain restriction - Check for @pausd.org users
  function checkEmailRestriction() {
    // Get user email from localStorage or prompt (you'll need to implement this based on your auth system)
    const userEmail = localStorage.getItem("userEmail") || "";
    
    // Check if email ends with @pausd.org
    if (userEmail.toLowerCase().endsWith("@pausd.org")) {
      // Show 403 error
      // document.body.innerHTML = `
      //   <div style="text-align: center; padding: 100px; color: white; font-family: 'Josefin Sans', sans-serif;">
      //     <h1 style="font-size: 3rem; color: #ff4d4d;">403 - Access Denied</h1>
      //     <p style="font-size: 1.5rem; margin-top: 20px;">
      //       Access to this resource is restricted for @pausd.org email addresses.
      //     </p>
      //     <p style="margin-top: 30px; opacity: 0.8;">
      //       Please use a different email address to access this site.
      //     </p>
      //     <a href="https://learn.jimmyqrg.com/?page=extend" style="display: inline-block; margin-top: 40px; padding: 12px 24px; background: rgba(255,255,255,0.1); border: 2px solid white; border-radius: 6px; color: white; text-decoration: none;">
      //       Return to Home
      //     </a>
      //   </div>
      // `;
      return false;
    }
    return true;
  }
