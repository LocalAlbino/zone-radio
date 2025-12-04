using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using ZoneRadio.Services;

namespace ZoneRadio;

/// <summary>
/// Interaction logic for MainWindow.xaml
/// </summary>
public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();
    }

    private void CloseButton_Click(object sender, RoutedEventArgs e)
    {
        // TODO: Implement cleanup logic for keyboard listener and http client
        // once they're implemented.
        Close();
    }

    private void MinimizeButton_Click(object sender, RoutedEventArgs e)
    {
        WindowState = WindowState.Minimized;
    }

    private void ConnectButton_Click(object sender, RoutedEventArgs e)
    {
        // NOTE: This is a placeholder for the actual implementation of the API service
        ConnectButton.IsEnabled = false;
        var api = new ApiService();
        api.RequestAuthAsync();
    }
}