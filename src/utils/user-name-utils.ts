export class UserNameUtils {
  static getUserInitials(fullName: string): string {
      if (!fullName) return 'U';

      const nameParts = fullName.trim().split(' ');
      if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();

      const firstName = nameParts[0];
      const lastName = nameParts[nameParts.length - 1];

      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  static getFirstAndLastName(fullName: string): string {
    
      if (!fullName) return 'Usuário';

      const nameParts = fullName.trim().split(' ');
      if (nameParts.length === 1) return nameParts[0];

      const firstName = nameParts[0];
      const lastName = nameParts[nameParts.length - 1];

      return `${firstName} ${lastName}`;
  }
}